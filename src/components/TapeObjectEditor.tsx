import React, { useState } from 'react';
import { textObject, linkObject } from '../types/ScrollBoxData';

export interface TapeObjectEditorProps {
  onSave?: (data: TapeObjectEditorData) => Promise<void>;
  initialData?: Partial<TapeObjectEditorData>;
}

export interface TapeObjectEditorData {
  position: { x: number; y: number; z: number };
  objectType: 'text' | 'link';
  textObject?: textObject;
  linkObject?: linkObject;
}

const TapeObjectEditor: React.FC<TapeObjectEditorProps> = ({
  onSave,
  initialData
}) => {
  const [position, setPosition] = useState({
    x: initialData?.position?.x ?? 0.4,
    y: initialData?.position?.y ?? 0.5,
    z: initialData?.position?.z ?? 1
  });
  
  const [objectType, setObjectType] = useState<'text' | 'link'>(
    initialData?.objectType ?? 'text'
  );
  
  const [textData, setTextData] = useState<textObject>({
    text: initialData?.textObject?.text ?? 'hello world',
    textColour: initialData?.textObject?.textColour ?? '#000000'
  });
  
  const [linkData, setLinkData] = useState<linkObject>({
    url: initialData?.linkObject?.url ?? '',
    text: initialData?.linkObject?.text ?? '',
    textColour: initialData?.linkObject?.textColour ?? '#000000'
  });

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0;
    setPosition(prev => ({ ...prev, [axis]: numValue }));
  };

  const handleTextDataChange = (field: keyof textObject, value: string) => {
    setTextData(prev => ({ ...prev, [field]: value }));
  };

  const handleLinkDataChange = (field: keyof linkObject, value: string) => {
    setLinkData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const editorData: TapeObjectEditorData = {
      position,
      objectType,
      textObject: objectType === 'text' ? textData : undefined,
      linkObject: objectType === 'link' ? linkData : undefined
    };
    
    console.log('Saving tape object data:', editorData);
    await onSave(editorData);
  };

  const renderObjectFields = () => {
    if (objectType === 'text') {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <textarea
              id="text-content"
              value={textData.text}
              onChange={(e) => handleTextDataChange('text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter text content"
            />
          </div>
          
          <div>
            <label htmlFor="text-color" className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <input
              id="text-color"
              type="color"
              value={textData.textColour}
              onChange={(e) => handleTextDataChange('textColour', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
        </div>
      );
    }
    
    if (objectType === 'link') {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="link-url" className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              id="link-url"
              type="url"
              value={linkData.url}
              onChange={(e) => handleLinkDataChange('url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label htmlFor="link-text" className="block text-sm font-medium text-gray-700 mb-1">
              Display Text (Optional)
            </label>
            <input
              id="link-text"
              type="text"
              value={linkData.text || ''}
              onChange={(e) => handleLinkDataChange('text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Custom link text (optional)"
            />
          </div>
          
          <div>
            <label htmlFor="link-color" className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <input
              id="link-color"
              type="color"
              value={linkData.textColour}
              onChange={(e) => handleLinkDataChange('textColour', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-300 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Tape Object Editor</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Position</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="position-x" className="block text-xs font-medium text-gray-600 mb-1">
                X
              </label>
              <input
                id="position-x"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={position.x}
                onChange={(e) => handlePositionChange('x', e.target.value)}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="position-y" className="block text-xs font-medium text-gray-600 mb-1">
                Y
              </label>
              <input
                id="position-y"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={position.y}
                onChange={(e) => handlePositionChange('y', e.target.value)}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="position-z" className="block text-xs font-medium text-gray-600 mb-1">
                Z
              </label>
              <input
                id="position-z"
                type="number"
                min="0"
                value={position.z}
                onChange={(e) => handlePositionChange('z', e.target.value)}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        <section>
          <div>
            <label htmlFor="object-type" className="block text-sm font-medium text-gray-700 mb-2">
              Object Type
            </label>
            <select
              id="object-type"
              value={objectType}
              onChange={(e) => setObjectType(e.target.value as 'text' | 'link')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="text">Text</option>
              <option value="link">Link</option>
            </select>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {objectType === 'text' ? 'Text Properties' : 'Link Properties'}
          </h3>
          {renderObjectFields()}
        </section>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Save Object
        </button>
      </div>
    </div>
  );
};

export default TapeObjectEditor;