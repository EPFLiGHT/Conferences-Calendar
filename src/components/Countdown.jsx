import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { Box, Flex, Text } from '@chakra-ui/react';

export default function Countdown({ deadline, label }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = DateTime.now();
    const diff = deadline.diff(now, ['days', 'hours', 'minutes', 'seconds']);

    if (diff.toMillis() <= 0) {
      return { expired: true };
    }

    return {
      days: Math.floor(diff.days),
      hours: Math.floor(diff.hours),
      minutes: Math.floor(diff.minutes),
      seconds: Math.floor(diff.seconds),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft.expired) {
    return (
      <Flex direction="column" gap="1.5">
        <Text
          fontSize="xs"
          fontWeight="600"
          color="gray.600"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {label}
        </Text>
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          Expired
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="1.5">
      <Text
        fontSize="xs"
        fontWeight="600"
        color="gray.600"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {label}
      </Text>
      <Flex gap="2" align="baseline">
        {timeLeft.days > 0 && (
          <Text fontSize="sm" color="gray.700">
            <Text as="span" fontSize="lg" fontWeight="700" color="brand.500">
              {timeLeft.days}
            </Text>
            d
          </Text>
        )}
        <Text fontSize="sm" color="gray.700">
          <Text as="span" fontSize="lg" fontWeight="700" color="brand.500">
            {timeLeft.hours}
          </Text>
          h
        </Text>
        <Text fontSize="sm" color="gray.700">
          <Text as="span" fontSize="lg" fontWeight="700" color="brand.500">
            {timeLeft.minutes}
          </Text>
          m
        </Text>
        <Text fontSize="sm" color="gray.700">
          <Text as="span" fontSize="lg" fontWeight="700" color="brand.500">
            {timeLeft.seconds}
          </Text>
          s
        </Text>
      </Flex>
    </Flex>
  );
}
