export type FormPostResult = {
  ok: boolean;
  status: number;
  json: unknown;
};

/**
 * POST multipart data and report upload byte progress.
 * `fetch` does not expose request upload progress, so this uses XHR.
 */
export function postFormData(
  url: string,
  formData: FormData,
  options: {
    onProgress?: (percent: number) => void;
    signal?: AbortSignal;
  } = {},
): Promise<FormPostResult> {
  const { onProgress, signal } = options;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const xhr = new XMLHttpRequest();
    const fail = () => reject(new Error("Upload failed"));

    xhr.open("POST", url);
    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable || event.total <= 0) return;
      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
    };
    xhr.onload = () => {
      let json: unknown = {};
      try {
        json = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        json = {};
      }
      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        json,
      });
    };
    xhr.onerror = fail;
    xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"));

    const onAbort = () => xhr.abort();
    signal?.addEventListener("abort", onAbort, { once: true });
    xhr.send(formData);
  });
}
