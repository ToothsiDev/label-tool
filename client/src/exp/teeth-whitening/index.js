import React, { useState } from 'react';
import { BeforeAfterImage } from './BeforeAfterImage';
import 'react-before-after-slider-component/dist/build.css';
import { UploadScreen } from './UploadScreen';

export default function(props) {
  const [beforeAfterImage, setImages] = useState(null);
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        flexDirection: 'column',
        position: 'relative',
        background: '#f3f3f3',
      }}
    >
      {beforeAfterImage != null ? (
        <div
          className="header"
          style={{
            display: 'flex',
            height: '80px',
            background: '#fff',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
            }}
            onClick={() => {
              setImages(null);
            }}
          >
            <img
              style={{
                objectFit: 'contain',
                width: '24px',
                height: '24px',
              }}
              src="https://asset1.toothsi.in/arrow_left_c6f41b3a55.svg?q=75&w=36"
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <img src="https://asset3.toothsi.in/Make_O_toothsi_114x38_2aee00d1e8_f8248eafda.svg?q=75&w=640" />
          </div>
        </div>
      ) : null}
      {beforeAfterImage != null ? (
        <BeforeAfterImage
          before={beforeAfterImage.before}
          after={beforeAfterImage.after}
        />
      ) : (
        <UploadScreen setImages={setImages} />
      )}
      {beforeAfterImage != null ? (
        <div
          className="footer"
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '80px',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: '20px 20px 0px 0px',
          }}
        />
      ) : null}
    </div>
  );
}
