import React, { useRef, useState } from 'react';
import axios from 'axios';

export function UploadScreen({ setImages }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(0);
  let uploadFileRef = useRef(null);

  const handleImageSelect = event => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleImageUpload = () => {
    setLoading(1);

    const formData = new FormData();
    formData.append('image', selectedImage);

    axios
      .post('http://43.205.236.181/whiten-teeth', formData)
      .then(response => {
        setLoading(0);
        var reader = new FileReader();
        var url = reader.readAsDataURL(selectedImage);
        console.log(url);
        reader.onloadend = function() {
          setImages({
            before: reader.result,
            after: `data:image/jpeg;base64,${response.data.image}`,
          });
        };
      })
      .catch(error => {
        console.error('Image upload failed:', error);
        setLoading(-1);
      });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontSize: '36px',
          fontWeight: '500',
          marginBottom: '40px',
        }}
      >
        Teeth Whitening Tool
      </div>
      <img src="https://asset3.toothsi.in/Make_O_toothsi_114x38_2aee00d1e8_f8248eafda.svg?q=75&w=640" />
      <div style={{ fontSize: '20px', margin: '36px 0', textAlign: 'center' }}>
        Please upload an image to whiten your teeth
      </div>
      <input
        type="file"
        multiple={false}
        accept="image/*"
        ref={uploadFileRef}
        style={{
          visibility: 'hidden',
          position: 'absolute',
        }}
        onChange={handleImageSelect}
      />

      {!selectedImage ? (
        <button
          onClick={() => {
            uploadFileRef.current.click();
          }}
          style={{
            backgroundColor: '#d2010d',
            color: '#fff',
            borderRadius: '50px',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Choose file to Upload
        </button>
      ) : (
        <>
          <button
            onClick={handleImageUpload}
            style={{
              backgroundColor: '#d2010d',
              color: '#fff',
              borderRadius: '50px',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
            }}
            disabled={!selectedImage || loading}
          >
            Upload selected Image
          </button>
          <div
            style={{
              textDecoration: 'underline',
              fontSize: '12px',
              lineHeight: 2,
            }}
            onClick={() => {
              setSelectedImage(null);
              setLoading(0);
            }}
          >
            Reset
          </div>
        </>
      )}
      <div
        style={{
          margin: '20px',
        }}
      />
      {loading == -1 && <p>Error While Uploading......</p>}
      {loading == 1 && <div className="dot-bricks"> </div>}
    </div>
  );
}
