import React from 'react';
import { Card } from 'react-bootstrap';

const StatsCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body className="d-flex align-items-center">
        <div 
          className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center"
          style={{ 
            backgroundColor: `${color}20`,
            width: '60px',
            height: '60px'
          }}
        >
          <span style={{ fontSize: '28px', color: color }}>{icon}</span>
        </div>
        <div>
          <h6 className="text-muted mb-1">{title}</h6>
          <h3 className="mb-0 fw-bold">{value}</h3>
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;