"use server";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const message = {
    to: to.toLowerCase().trim(),
    from: process.env.EMAIL_FROM,
    subject: subject.trim(),
    text: text.trim(),
  };

  try {
    console.log("email send:", JSON.stringify(message));

    // const [response] = await Mail.sendMail(message);

    // if (response.statusCode !== 202) {
    //   throw new Error(`Failed to send email: ${response.body}`);
    // }

    return {
      success: true,
      messageId: text, // response.headers["x-message-id"],
    };
  } catch (error) {
    console.error("Error sending email:", error);

    return {
      success: false,
      message: "Failed to send email. Please try again later...",
    };
  }
}
