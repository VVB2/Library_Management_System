const sendGridMail = require('@sendgrid/mail')
sendGridMail.setApiKey('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')

function getMessage() {
    const body = 'This is a test email using SendGrid from Node.js';
    return {
        from: '201903004.vinodbvv@student.xavier.ac.in', // Change to your recipient
        to: '201903004.vinodbvv@student.xavier.ac.in',
      subject: 'Test email with Node.js and SendGrid',
      text: body,
      html: `<strong>${body}</strong>`,
    };
  }


async function sendEmail() {
    try {
      await sendGridMail.send(getMessage());
      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body)
      }
    }
  }
  
  (async () => {
    console.log('Sending test email');
    await sendEmail();
  })();