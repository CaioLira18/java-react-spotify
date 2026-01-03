import React from 'react'

const Toast = ({ toasts, removeToast }) => {
    return (
        <div className="notification-toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`notification-toast toast-style-${toast.type}`}>
                    <span>{toast.message}</span>
                    <button onClick={() => removeToast(toast.id)}>×</button>
                </div>
            ))}
        </div>
    )
}

export default Toast