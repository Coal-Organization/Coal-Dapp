import { NextPage } from "next";

const RegisterSong: NextPage = () => {
  return (
    <div className="flex items-center flex-col flex-grow pt-10 justify-center items-center">
      <div className="px-5">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">Register your Song</span>
        </h1>
      </div>
      <div>
        <input type="file" accept="audio/*" />
        <button>Upload</button>
      </div>
    </div>
  );
};

export default RegisterSong;
