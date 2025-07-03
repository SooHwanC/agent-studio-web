import React from 'react';

const SchemaDisplay = ({ schema }) => {
  if (!schema || typeof schema !== 'object') {
    return <div className="schema-empty">스키마 정보 없음</div>;
  }

  const { type, properties, required = [] } = schema;

  return (
    <div className="schema-display">
      <div className="schema-type">타입: {type || 'object'}</div>
      
      {properties && Object.keys(properties).length > 0 && (
        <div className="schema-properties">
          <div className="properties-title">파라미터:</div>
          {Object.entries(properties).map(([key, prop]) => (
            <div key={key} className="property-item">
              <div className="property-header">
                <span className="property-name">{key}</span>
                {required.includes(key) && <span className="required-badge">필수</span>}
                <span className="property-type">{prop.type || 'any'}</span>
              </div>
              {prop.description && (
                <div className="property-description">{prop.description}</div>
              )}
              {prop.enum && (
                <div className="property-enum">
                  가능한 값: {prop.enum.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchemaDisplay;