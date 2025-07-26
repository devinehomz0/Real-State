import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import pano from "../../assets/pano.jpg"
export default function PanaromicView() {
  return (
    <div className="pano_div">
      <h1>This is panoromic page </h1>
      <ReactPhotoSphereViewer
        src={pano}
        height={"100%"}
        width={"100%"}
        
      ></ReactPhotoSphereViewer>
    </div>
  );
}
