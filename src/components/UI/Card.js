import React from 'react';

import './Card.css';

const Card = props => {
    return <div className="card">Cards: {props.children}</div>;
};

export default Card;