import React, { useState, useRef } from 'react';
import ImageUploadModal from '../../components/ImageUploadModal/ImageUploadModal';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import { scanRecipe } from '../../utils/api'; // Import the scanRecipe function

const ImagePreprocessingPage = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(150); // Set default brightness to 50%
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [mode, setMode] = useState(null); // Mode is null initially
  const [rectangles, setRectangles] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newRect, setNewRect] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const imageRef = useRef();
  const stageRef = useRef();
  const trRef = useRef();

  const handleImageUpload = (files) => {
    const file = files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImageFile(file);
      setIsModalOpen(false);
    }
  };

  const handleMouseDown = (e) => {
    if (!isDrawing && mode) {
      const { x, y } = e.target.getStage().getPointerPosition();
      setNewRect({ x, y, width: 0, height: 0, mode, id: `rect${Date.now()}` });
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing && newRect) {
      const { x, y } = e.target.getStage().getPointerPosition();
      setNewRect({
        ...newRect,
        width: x - newRect.x,
        height: y - newRect.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setRectangles([...rectangles, newRect]);
      setIsDrawing(false);
      setNewRect(null);
      setMode(null); // Reset mode after creating the rectangle
    }
  };

  const handleRectTransform = (e) => {
    const id = e.target.id();
    const newRectangles = rectangles.slice();
    const rect = newRectangles.find((r) => r.id === id);
    if (rect) {
      rect.x = e.target.x();
      rect.y = e.target.y();
      rect.width = e.target.width() * e.target.scaleX();
      rect.height = e.target.height() * e.target.scaleY();
      e.target.scaleX(1);
      e.target.scaleY(1);
      setRectangles(newRectangles);
    }
  };

  const handleSelectRect = (e) => {
    const id = e.target.id();
    setSelectedId(id);
    const transformer = trRef.current;
    transformer.nodes([e.target]);
    transformer.getLayer().batchDraw();
  };

  const handleDeleteRect = (id) => {
    setRectangles(rectangles.filter((rect) => rect.id !== id));
    setSelectedId(null);
  };

  const checkDeselect = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const handleScanRecipe = async () => {
    const payload = {
      filters: {
        blur,
        brightness,
        contrast,
        grayscale,
      },
      rectangles,
      imageFile,
      imageDimensions: {
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      },
      displayedDimensions: {
        width: imageRef.current.width,
        height: imageRef.current.height,
      },
    };
    console.log('Payload sent:', payload);

    const formData = new FormData();
    formData.append('filters', JSON.stringify(payload.filters));
    formData.append('rectangles', JSON.stringify(payload.rectangles));
    formData.append('imageDimensions', JSON.stringify(payload.imageDimensions));
    formData.append(
      'displayedDimensions',
      JSON.stringify(payload.displayedDimensions)
    );
    formData.append('imageFile', payload.imageFile);

    try {
      const result = await scanRecipe(formData);
      console.log('Payload sent:', payload);
      console.log('Response from backend:', result);
    } catch (error) {
      console.error('Error scanning recipe:', error);
    }
  };

  return (
    <div className="text-gray-800 text-left flex">
      <main className="max-w-6xl mx-auto p-6 bg-white mt-6">
        <h2 className="text-2xl font-bold mb-4">Image Preprocessing</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Upload Image
        </button>
        {imageUrl && (
          <div className="relative">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Uploaded"
              style={{
                filter: `
                  blur(${blur}px)
                  brightness(${brightness}%)
                  contrast(${contrast}%)
                  grayscale(${grayscale}%)
                `,
                width: '600px',
                height: '400px',
              }}
            />
            <Stage
              ref={stageRef}
              width={600}
              height={400}
              onMouseDown={(e) => {
                checkDeselect(e);
                handleMouseDown(e);
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="absolute top-0 left-0"
            >
              <Layer>
                {rectangles.map((rect, i) => (
                  <Rect
                    key={i}
                    id={rect.id}
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill={
                      rect.mode === 'ingredients'
                        ? 'rgba(0, 255, 0, 0.5)'
                        : 'rgba(255, 0, 0, 0.5)'
                    }
                    stroke={rect.mode === 'ingredients' ? 'green' : 'red'}
                    strokeWidth={2}
                    draggable
                    onClick={handleSelectRect}
                    onTransformEnd={handleRectTransform}
                    onDragEnd={handleRectTransform}
                  />
                ))}
                {newRect && (
                  <Rect
                    x={newRect.x}
                    y={newRect.y}
                    width={newRect.width}
                    height={newRect.height}
                    fill={
                      newRect.mode === 'ingredients'
                        ? 'rgba(0, 255, 0, 0.5)'
                        : 'rgba(255, 0, 0, 0.5)'
                    }
                    stroke={newRect.mode === 'ingredients' ? 'green' : 'red'}
                    strokeWidth={2}
                  />
                )}
                <Transformer
                  ref={trRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    // Limit resize
                    if (newBox.width < 5 || newBox.height < 5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              </Layer>
            </Stage>
          </div>
        )}
        <button
          onClick={handleScanRecipe}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Scan Recipe
        </button>
      </main>

      <aside className="w-1/3 p-6 bg-gray-100">
        <div className="mb-4">
          <label className="block mb-2">Gaussian Blur</label>
          <input
            type="range"
            min="0"
            max="10"
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Brightness</label>
          <input
            type="range"
            min="0"
            max="200"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Contrast</label>
          <input
            type="range"
            min="0"
            max="200"
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Grayscale</label>
          <input
            type="range"
            min="0"
            max="100"
            value={grayscale}
            onChange={(e) => setGrayscale(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Create Area</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setMode('ingredients')}
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${rectangles.find((rect) => rect.mode === 'ingredients') ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={
                !!rectangles.find((rect) => rect.mode === 'ingredients')
              }
            >
              Ingredients
            </button>
            <button
              onClick={() => setMode('instructions')}
              className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${rectangles.find((rect) => rect.mode === 'instructions') ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={
                !!rectangles.find((rect) => rect.mode === 'instructions')
              }
            >
              Instructions
            </button>
          </div>
        </div>
        {selectedId && (
          <button
            onClick={() => handleDeleteRect(selectedId)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Delete Selected Rectangle
          </button>
        )}
      </aside>

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleImageUpload}
      />
    </div>
  );
};

export default ImagePreprocessingPage;
