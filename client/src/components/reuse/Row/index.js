import React from "react";
import "./Row.scss";

const Row = ({children, justifyContent, alignItems, className, width, height}) => {
    const style = {
        justifyContent: justifyContent,
        alignItems: alignItems,
        width: width,
        height: height,
    }

    return (
        <div style={style} className={className ? "Row " + className : "Row"}>
            {children}
        </div>
    );
}

export default Row;