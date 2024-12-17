const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/', {
        method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
        headers: {
          'Content-Type': 'application/json', // Set content type if sending JSON
        },
      });
  
      if (!response.ok) {
        // Handle error response
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json(); // Parse the JSON response
      console.log('Data:', data); // Process the data
    } catch (error) {
      console.error('Error fetching data:', error.message); // Log any errors
    }
  };
  
console.log("HI");
fetchData(); // Make the request when the component mounts
  