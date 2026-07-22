import { useState, useEffect } from 'react';
import { getResumeStatus, API_BASE_URL } from './api';

/**
 * Fetches whether a resume is uploaded and returns a proxied download URL.
 *
 * Why proxy? Cloudinary raw resource URLs return 401 when accessed directly
 * from the browser. The server's /api/resume/download endpoint fetches the
 * file server-to-server (no auth issues) and streams it to the client.
 *
 * Returns { resumeUrl, resumeExists, loading, error }
 */
const useResumeUrl = () => {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [resumeExists, setResumeExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getResumeStatus()
      .then((res) => {
        if (res.data?.success && res.data?.exists) {
          // Use our server proxy instead of the direct Cloudinary URL.
          // This avoids the 401 Unauthorized that Cloudinary returns for raw
          // resources when accessed directly from a browser.
          const downloadUrl = `${API_BASE_URL}/resume/download`;
          setResumeUrl(downloadUrl);
          setResumeExists(true);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return { resumeUrl, resumeExists, loading, error };
};

export default useResumeUrl;
