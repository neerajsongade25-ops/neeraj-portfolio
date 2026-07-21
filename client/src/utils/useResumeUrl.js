import { useState, useEffect } from 'react';
import { getResumeStatus } from './api';

/**
 * Fetches the resume URL from the backend Cloudinary store.
 * Returns { resumeUrl, resumeExists, loading, error }.
 *
 * States:
 *   resumeExists = true  → resume is uploaded, resumeUrl has the Cloudinary URL
 *   resumeExists = false → confirmed no resume uploaded (API said success:true, exists:false)
 *   error = true         → API call failed (Cloudinary not configured, server down, etc.)
 */
const useResumeUrl = () => {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [resumeExists, setResumeExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getResumeStatus()
      .then((res) => {
        if (res.data?.success && res.data?.exists && res.data?.url) {
          setResumeUrl(res.data.url);
          setResumeExists(true);
        }
        // else: success but no resume uploaded — stay at defaults (exists: false)
      })
      .catch(() => {
        // API failed (server error, Cloudinary not configured, network issue)
        // Don't silently disable the button — mark as error so we can show a tooltip
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return { resumeUrl, resumeExists, loading, error };
};

export default useResumeUrl;
