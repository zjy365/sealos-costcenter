import { ComponentStyleConfig, defineStyleConfig, extendTheme } from '@chakra-ui/react';

const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: '4px'
  },
  sizes: {
    sm: {},
    md: {},
    primary: {
      width: '215px',
      height: '36px'
    }
  },
  variants: {
    primary: {
      backgroundColor: '#3E3B3B',
      _hover: {
        backgroundColor: '#3E3B3B'
      },
      color: '#FEFEFE'
    }
  }
});

const Input = defineStyleConfig({});

const Select = defineStyleConfig({
  variants: {
    filled: {
      field: {
        backgroundColor: '#F4F6F8'
      }
    }
  },
  defaultProps: {
    size: 'md',
    variant: 'filled'
  }
});

export const theme = extendTheme({
  components: {
    Button,
    Input,
    Select
  }
});