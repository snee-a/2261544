// src/pages/ShortenerPage.jsx
import React,{useState} from "react";
import axios from "axios";
import {TextField,Button,Box,Typography} from "@mui/material";


export default function ShorterPage() {
  const [url,setUrl]=useState([{ url: "",validity: "",shortcode: ""}]);
  const [results,setResults]=useState([]);
  const handleChange = (index, field, value) => {
    const updatedVal = [...url];
    updatedVal[index][field] = value;
    setUrl(updatedVal);
  };
  const addedUrlFields = () => {
    if (url.length < 5) setUrl([...url, { url: "", validity: "", shortcode: "" }]);
  };
  const handleSubmit = async () => {
    const promisesUsed = url.map(async (u) => {
      if (!u.url) {
              return null
            };
      const payload = {
             url: u.url
             };
      if (u.validity) payload.validity = parseInt(u.validity);
      if (u.shortcode) payload.shortcode = u.shortcode;
      try {
        const res = await axios.post("http://localhost:4000/shorturls", payload);
        return res.data;
      } catch (err) {
        return { error: true };
      }
    });

    const data = await Promise.all(promisesUsed);
    setResults(data.filter((r) => r));
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      {url.map((u, idx) => (
        <Box key={idx} mb={2}>
          <TextField 
            label="Enter Long URL" //here we want to input our long url
            fullWidth
            value={u.url}
            onChange={(e) => handleChange(idx, "url", e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            label="Enter Validity (min)" //entering the validity 
            type="number"
            value={u.validity}
            onChange={(e) => handleChange(idx, "validity", e.target.value)}
            sx={{ mr: 1 }}
          />
          <TextField
            label="Enter Custom Shortcode"
            value={u.shortcode}  //its custom shortcode it may be empty
            onChange={(e) => handleChange(idx, "shortcode", e.target.value)}
          />
        </Box>
      ))}
      <Button variant="contained" onClick={addedUrlFields}>+ Add URL</Button>
      <Button variant="contained" onClick={handleSubmit} sx={{ ml: 2 }}>Shorten</Button>

      <Box mt={4}>
        {results.map((res, i) => ( <Typography key={i}> {res.shortLink} — Expires: {res.expiry}</Typography> ))}
      </Box>
    </Box>
  );
}


