import TapeObjectEditor from "../components/TapeObjectEditor";
import ImageDropZone from "../components/ImageDropZone";
import { saveTapeObject, saveImageObject } from "../services/saveTapeObject";




/**
 * Palette for adding items 
 */
const Palette = () => {
  return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <section className="max-w-5xl">
           <section>
              <h3 className="text-sm font-medium text-gray-700 mb-3">drop your links, writing, and pictures here!</h3>
              <TapeObjectEditor onSave={saveTapeObject} />
            </section>
            
            <section className="mt-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">upload images</h3>
              <ImageDropZone onImageSelected={saveImageObject} />
            </section>
        </section>
      </main>

      </div>
  );
};

export default Palette;
