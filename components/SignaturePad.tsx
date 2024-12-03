import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
}

export function SignaturePad({ onSave }: SignaturePadProps) {
  const signaturePadRef = useRef<SignatureCanvas>(null);

  const clear = () => {
    signaturePadRef.current?.clear();
  };

  const save = () => {
    const dataUrl = signaturePadRef.current?.getTrimmedCanvas().toDataURL();
    if (dataUrl) {
      onSave(dataUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-300 rounded">
        <SignatureCanvas
          ref={signaturePadRef}
          canvasProps={{
            className: "signature-canvas",
            width: 500,
            height: 200,
          }}
        />
      </div>
      <div className="space-x-4">
        <button
          onClick={clear}
          className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
        >
          Clear
        </button>
        <button
          onClick={save}
          className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
}
