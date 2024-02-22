import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import jsonData from "./course.json";

const CsvReader = () => {
  const [csvData, setCsvData] = useState([]);
  const [OTTID, setOTTID] = useState([]);
  const [matchingData, setMatchingData] = useState([]);

  const handleDownloadCsv = () => {
    if (matchingData.length > 0) {
      try {
        const flattenedData = matchingData.map(
          ({ course, chapter, video }) => ({
            ...course,
            ...chapter,
            ...video,
          })
        );

        const csv = Papa.unparse(flattenedData);

        const blob = new Blob([csv], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "matching_data.csv";
        link.click();
      } catch (error) {
        console.error("Error creating CSV file:", error);
      }
    }
  };

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
          ).map((matchingVideo) => ({
            course: {
              SKU: course.SKU,
              coursePDF: course.coursePDF,
              description: course.description,
              Course_id: course.id,
              course_small_image: course.images.course_small,
              course_large_image: course.images.course_large,
              theme_small_image: course.images.theme_small,
              theme_large_image: course.images.theme_large,
              intro_description: course.intro_description,
              intro_streaming_url: course.intro_streaming_url,
              module_count: course.module_count,
              name: course.name,
              runtime: course.runtime,
              strapline: course.strapline,
              theme_id: course.theme.theme_id,
              theme_name: course.theme.theme_name,
              theme_trailer: course.theme.theme_trailer,
              trailer: course.trailer,
              trainer_list: course.trainer_list,
              video_count: course.video_count,
            },
            chapter: {
              id: chapter.id,
              name: chapter.name,
              description: chapter.description,
            },
            video: matchingVideo,
          }))
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

      <button onClick={handleDownloadCsv}>Download Matching Data as CSV</button>
    </div>
  );
};
export default CsvReader;
