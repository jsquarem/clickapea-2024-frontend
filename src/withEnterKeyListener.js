import React, { useEffect } from 'react';

const withEnterKeyListener = (WrappedComponent) => {
  return (props) => {
    useEffect(() => {
      const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
          const activeElement = document.activeElement;
          if (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA'
          ) {
            event.preventDefault();
            const form = activeElement.form;
            if (form) {
              const button = form.querySelector(
                'button[type="submit"], button'
              );
              if (button) {
                button.click();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleEnterKey);

      return () => {
        document.removeEventListener('keydown', handleEnterKey);
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withEnterKeyListener;
