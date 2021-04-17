import "./index.less";
import React from 'react'
import ReactDOM from 'react-dom';

export default function Modal
    ({
        visible,
        onClose,
        title,
        header,
        children,
        footer,
        bodyStyle
    }) {

    const visibility = visible? "initial":"hidden";    

    const modal =  (
        <div className="tv-modal" style={{visibility}}>
            <div className="tv-modal-backdrop"></div>
            <div className="tv-modal-container" onClick={(event)=>{event.stopPropagation(); onClose();}}>
                <div className="tv-modal-body" style={bodyStyle} onClick={(e) => e.stopPropagation()}>
                    <div className="tv-modal-body-header">
                        <div>
                            {title}
                            {header}
                        </div>
                        <div className="tv-modal-body-close" onClick={()=>{ onClose();}}></div>
                    </div>

                    <div className="tv-modal-body-content">
                        {children}
                    </div>

                    <div className="tv-modal-body-footer">
                        {footer}
                    </div>
                </div>
            </div>

        </div>
    );

    return ReactDOM.createPortal(modal,document.querySelector("body"));
}
