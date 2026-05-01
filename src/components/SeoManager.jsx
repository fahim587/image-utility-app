import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SeoManager = ({ toolName }) => {
  const location = useLocation();
  const baseUrl = "https://googiz.com";
  // location.pathname অটোমেটিক বর্তমান পেজের পাথ দেবে
  const canonicalUrl = `${baseUrl}${location.pathname}`;

  return (
    <Helmet>
      <title>{toolName} - GOOGIZ</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="description" content={`${toolName} টুলটি ব্যবহার করে অনলাইনে সহজেই কাজ শেষ করুন।`} />
    </Helmet>
  );
};

export default SeoManager;