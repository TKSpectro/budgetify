export interface Props {
  text: String;
  type: String;
  progress: Number;
  value?: String;
}

// https://www.creative-tim.com/learning-lab/tailwind/nextjs/progressbars/notus
// Good implementation of a progressbar with some minor changes
export function Progressbar({ text, type, progress = 0, value, ...props }: Props) {
  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-brand-600 bg-brand-200">
            {text}
          </span>
          <span className="text-xs font-semibold inline-block py-1 px-2 ml-2 uppercase rounded-full text-brand-600 bg-brand-200">
            {type}
          </span>
          {value && (
            <span className="text-xs font-semibold inline-block py-1 px-2 ml-2 uppercase rounded-full text-brand-600 bg-brand-200">
              {value}
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-brand-600">{progress}%</span>
        </div>
      </div>
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-brand-200">
        <div
          // Need to set width per style because if we would set it in className the tailwindJIT
          // Compiler would not know that he need to generate w-progress at the moment of creation
          style={{ width: progress.toString() + '%' }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-500"
        ></div>
      </div>
    </div>
  );
}
