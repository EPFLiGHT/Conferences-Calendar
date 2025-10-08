/**
 * InfoTooltip Component
 *
 * Reusable tooltip wrapper with consistent styling.
 * Used across the app for badges and interactive elements.
 */

import { Tooltip } from '@chakra-ui/react/tooltip';

interface InfoTooltipProps {
  label: string;
  children: React.ReactNode;
}

export default function InfoTooltip({ label, children }: InfoTooltipProps): JSX.Element {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content
          fontSize="sm"
          borderRadius="md"
          bg="gray.800"
          color="white"
          px="3"
          py="2"
        >
          <Tooltip.Arrow>
            <Tooltip.ArrowTip />
          </Tooltip.Arrow>
          {label}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
}