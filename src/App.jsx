import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import jsonData from "./course.json";

const CsvReader = () => {
  const [csvData, setCsvData] = useState([]);
  const [OTTID, setOTTID] = useState([]);
  const [matchingData, setMatchingData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);
        },
        header: true,
      });
    }
  };

  useEffect(() => {
    const filteredData = jsonData.Courses.flatMap((course) =>
      course.Chapters.flatMap((chapter) =>
        OTTID.flatMap((id) =>
          chapter.Videos.filter(
            (video) => Number(video.streaming_url) === Number(id)
          )
        )
      )
    );

    setMatchingData(filteredData);
  }, [OTTID]);

  useEffect(() => {
    setOTTID(
      csvData.filter((data) => data.id !== "").map((data) => data.OTTID)
    );
  }, [csvData]);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      {OTTID.map((data, key) => {
        return <p key={key}>Id of CSV File : {data}</p>;
      })}
    </div>
  );
};
export default CsvReader;
