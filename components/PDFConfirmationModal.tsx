export const PDFConfirmationModal = ({ onConfirm, onCancel, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            border: 'none',
            borderRadius: '50%',
            backgroundColor: '#f5f5f5',
            color: '#666',
            cursor: 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            padding: 0
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e0e0e0';
            e.currentTarget.style.color = '#333';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
            e.currentTarget.style.color = '#666';
          }}
          aria-label="Close"
        >
          ×
        </button>

        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 20px',
          backgroundColor: '#E3F2FD',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px'
        }}>
          📄
        </div>
        
        <h2 style={{
          margin: '0 0 12px',
          fontSize: '24px',
          fontWeight: '600',
          color: '#1a1a1a'
        }}>
          Do you already have a PDF?
        </h2>
        
        <p style={{
          margin: '0 0 28px',
          fontSize: '15px',
          color: '#666',
          lineHeight: '1.5'
        }}>
          If you already have a PDF file, we'll take you directly to the converter.
          Otherwise, we'll generate one for you first.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: '500',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#333',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flex: 1
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.borderColor = '#d0d0d0';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }}
          >
            No, generate PDF
          </button>
          
          <button
            onClick={onConfirm}
            style={{
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#3498db',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flex: 1
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2980b9';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3498db';
            }}
          >
            Yes, I have one
          </button>
        </div>
      </div>
    </div>
  );
};