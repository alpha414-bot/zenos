/**
 *
 * @param phone string/integer to crosscheck
 * @param phonesArray array of phone number in the database already
 * @returns
 */
export const CheckPhoneExistence = (
  phone: string | number,
  phonesArray: Array<{ phone: string | number; username: string }>
) => {
  return phonesArray.some((obj) => obj.phone == phone);
};

/**
 * checking if username is available or in use
 *
 * @param username string to crosscheck
 * @param usernamesArray array of username present in the database already
 * @returns
 */
export const CheckUsernameSimilarity = (
  username: string,
  usernamesArray: Array<{ phone: string | number; username: string }>
) => {
  const similarityThreshold = 0.8; // Adjust the threshold as per your requirements
  for (let i = 0; i < usernamesArray.length; i++) {
    const similarity = CalculateSimilarity(
      username,
      usernamesArray[i]?.username
    );
    if (similarity >= similarityThreshold) {
      return "Username is not available. Try another."; // Similar username found
    }
  }

  return true; // no similar usernames found
};

const CalculateSimilarity = (username1: string, username2: string) => {
  const lowercaseUsername1 = username1.toLowerCase();
  const lowercaseUsername2 = username2.toLowerCase();

  const editDistance = CalculateEditDistance(
    lowercaseUsername1,
    lowercaseUsername2
  );
  const maxLength = Math.max(
    lowercaseUsername1.length,
    lowercaseUsername2.length
  );

  const similarity = 1 - editDistance / maxLength;
  return similarity;
};

const CalculateEditDistance = (string1: string, string2: string) => {
  const dp = Array(string1.length + 1)
    .fill(null)
    .map(() => Array(string2.length + 1).fill(null));

  for (let i = 0; i <= string1.length; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= string2.length; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= string1.length; i++) {
    for (let j = 1; j <= string2.length; j++) {
      const cost = string1[i - 1] === string2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[string1.length][string2.length];
};

/**
 * Checking how strong and if string passed password validation rules
 *
 * @param password The string under validation
 * @returns the validation state
 */
export const CheckPassword = (password: string) => {
  // At least 8 characters
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  // At least one uppercase letter, one lowercase letter, and one number
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  if (
    !uppercaseRegex.test(password) ||
    !lowercaseRegex.test(password) ||
    !numberRegex.test(password)
  ) {
    return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
  }

  return true; // Password is valid
};
