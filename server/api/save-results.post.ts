export default defineEventHandler(async (event) => {
  // Read the email and resultsUrl from the request body
  const { email, resultsUrl } = await readBody(event);

  if (!email || !resultsUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing email or resultsUrl',
    });
  }

  // --- IMPORTANT ---
  // Replace with your actual Google Form URL and entry IDs
  const formId = "1FAIpQLSeIE3nfh4Xz-S2gghPLBaLf86a1tPQAHk-NZesmz7QWotLjdw"; // The long string from your form's URL, e.g., 1FAIpQLSe...
  const googleFormUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  
  const emailEntryId = "entry.630742224"; // From inspecting the form, e.g., entry.111111111
  const linkEntryId = "entry.825136623";   // From inspecting the form, e.g., entry.222222222

  // We need to submit the data as form-urlencoded
  const formData = new URLSearchParams();
  formData.append(emailEntryId, email);
  formData.append(linkEntryId, resultsUrl);

  try {
    // Use $fetch to send the data to the Google Form
    await $fetch(googleFormUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    return { success: true, message: 'Results saved successfully.' };

  } catch (error) {
    console.error('Error submitting to Google Form:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save results.',
    });
  }
});
