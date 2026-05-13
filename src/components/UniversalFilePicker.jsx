import * as GooglePicker from "react-google-drive-picker";
import { useState } from "react";

const UniversalFilePicker = ({ onFileSelect }) => {
  const [isLoading, setIsLoading] = useState(false);

  const openPicker = GooglePicker?.default;

  const handleGoogleDrive = () => {
    if (!openPicker) {
      alert("Google Drive picker not loaded");
      return;
    }

    openPicker({
      clientId: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID,
      developerKey: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY,
      viewId: "DOCS",
      multiselect: false,

      callbackFunction: (data) => {
        if (data.action === "picked") {
          const file = data.docs[0];

          onFileSelect({
            source: "google-drive",
            data: file,
          });
        }
      },
    });
  };

  return (
    <button onClick={handleGoogleDrive}>
      Google Drive
    </button>
  );
};

export default UniversalFilePicker;