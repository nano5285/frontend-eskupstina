import { Worker } from '@react-pdf-viewer/core';
import { Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
export default function PdfViewer({ url }) {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    width: '100%',
                    height: '100%',
                }}
            >
                <Viewer fileUrl={url} defaultScale={SpecialZoomLevel.PageFit} />
            </div>
        </Worker>
    )
}
