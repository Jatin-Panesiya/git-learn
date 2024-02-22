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
    const filteredData = jsonData.Courses.map((course) =>
      course.Chapters.map((chapter) => {
        OTTID.map((id) => {
          // console.log(+id === 3064788, "id static");
          return chapter.Videos.filter((video) => {
            // console.log(+video.streaming_url === +id);
            +video.streaming_url == +id;
          });
        });
      })
    );

    setMatchingData(filteredData);
  }, [OTTID]);

  console.log(matchingData, "matchingData");

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
