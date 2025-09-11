import React from 'react';

export interface SidePanelProps {
  children?: React.ReactNode;
  width?: string;
  position?: 'left' | 'right';
  title?: string;
  className?: string;
}

const SidePanel: React.FC<SidePanelProps> = ({
  children,
  width = '400px',
  position = 'right',
  title,
  className = ''
}) => {
  const positionClasses = position === 'left' ? 'order-1' : 'order-2';

  return (
    <aside 
      className={`bg-gray-800 border-l border-gray-600 ${positionClasses} ${className} h-screen flex flex-col`}
      style={{ 
        width, 
        minWidth: width,
        background: 'linear-gradient(180deg, #2d3748 0%, #1a202c 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}
    >
      {title && (
        <header className="px-6 py-4 border-b border-gray-600 flex-shrink-0" style={{
          background: 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)'
        }}>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </header>
      )}
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </aside>
  );
};

export default SidePanel;