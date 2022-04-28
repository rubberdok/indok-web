const LoadingButton: any = () => {
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-text": {
            "& .MuiLoadingButton-startIconPendingStart": {
              marginLeft: 0,
            },
            "& .MuiLoadingButton-endIconPendingEnd": {
              marginRight: 0,
            },
          },
        },
      },
    },
  };
};

export default LoadingButton;
