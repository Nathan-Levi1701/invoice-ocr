export const handleFirebaseErrors = (code: string) => {
  switch (code) {
    case 'auth/email-already-in-use': {
      return 'A user with this email address already exists';
    }
    case 'auth/user-not-found': {
      return 'Invalid credentials or there is no associated user';
    }
    case 'auth/requires-recent-login': {
      return 'auth/requires-recent-login';
    }
    case 'auth/too-many-requests': {
      return 'You\'ve requested too many times. Please try again later'
    }
    case 'auth/operation-not-allowed': {
      return 'Something has gone wrong.  Please contact your system administrator'
    }
    default: {
      return code;
    }
  }
}

