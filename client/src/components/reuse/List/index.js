import React from "react";
import { any, arrayOf, object, func, string } from "prop-types";
import styles from "./List.scss";

const List = ({ children, className, itemComponent, items }) => (
    <ul className={className ? `${styles.List} ` + className : styles.List}>
        {children}
    </ul>
);

List.propTypes = {
    children: any,
    className: string,
    items: arrayOf(object),
    itemComponent: func,
}

export default List;
