import React from 'react';

export function ApplyMakeoKitScreen({
  handleImageUpload,
  disabled,
  before,
  loading,
}) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          height: 'calc(100% - 100px)',
        }}
      >
        <img
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          src={before}
        />
      </div>
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
      >
        {!loading ? (
          <button
            onClick={handleImageUpload}
            style={{
              backgroundColor: '#d2010d',
              color: '#fff',
              borderRadius: '50px',
              margin: '10px 20px',
              width: 'calc(100% - 40px)',
              height: 'calc(100% - 20px)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
            }}
            disabled={disabled}
          >
            Apply Makeo AI
          </button>
        ) : null}
        {loading == -1 && <p>Error While Uploading......</p>}
        {loading == 1 && <div className="dot-bricks"> </div>}
      </div>
    </>
  );
}
