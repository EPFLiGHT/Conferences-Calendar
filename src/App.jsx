import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Center, Text, Heading } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';
import { parseConferences } from './utils/parser';

function App() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/conferences.yaml`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch conferences data');
        }
        return response.text();
      })
      .then(yamlText => {
        const parsed = parseConferences(yamlText);
        setConferences(parsed);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Center minH="100vh">
        <Text fontSize="lg" color="gray.600">
          Loading conferences...
        </Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="100vh" p="8">
        <Box textAlign="center">
          <Heading as="h2" size="lg" mb="4" color="gray.800">
            Error Loading Data
          </Heading>
          <Text color="gray.600">{error}</Text>
        </Box>
      </Center>
    );
  }

  return (
    <BrowserRouter basename="/Conferences-Calendar">
      <Header />
      <Routes>
        <Route path="/" element={<Home conferences={conferences} />} />
        <Route path="/calendar" element={<CalendarPage conferences={conferences} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
