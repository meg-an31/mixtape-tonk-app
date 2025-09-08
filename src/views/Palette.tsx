import TapeObjectEditor from "../components/TapeObjectEditor";
import { saveTapeObject } from "../services/saveTapeObject";


/**
 * A simple Hello World view component that demonstrates basic layout and styling
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
        </section>
      </main>

      </div>
  );
};

export default Palette;
