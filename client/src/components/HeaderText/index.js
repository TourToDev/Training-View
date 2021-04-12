import "./index.less";

import React from 'react'

export default function HeaderText({icon,children}) {
    return (
        <div className="tv-app-title">
            {icon? icon : null}
            <span className="tv-app-title-text">
                {children}
            </span>
        </div>
    )
}

