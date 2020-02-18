// database storage method
  async store(req, res) {
    try {
      // getting the user data
      const { email, name, phone, cpf, password } = req.body;

      // creating the userId
      const key = firebase
        .database()
        .ref()
        .child("users")
        .push().key;

      // verification of email and phone fields
      if (!email || email === "" || /\s/g.test(email) || email === null) {
        if (!phone || phone === "" || /\s/g.test(phone) || phone === null) {
          return res.status(406).json({
            message: "Invalid email or phone."
          });
        }
      }

      // creating the userData
      const userData = {
        key: key,
        email: email || null,
        name: name || null,
        phone: phone || null,
        cpf: cpf || null,
        password: password || null,
        active: true
      };

      // database query
      const query = await firebase.database().ref(`users`);

      // searching on database
      await query.once("value", snapShot => {
        const cpfsChilds = [];
        const phonesChilds = [];
        const emailsChilds = [];
        snapShot.forEach(child => {
          cpfsChilds.push(child.val().cpf);
          phonesChilds.push(child.val().phone);
          emailsChilds.push(child.val().email);
        });

        // Verify if cpf, phone or email is already in Database
        if (
          cpfsChilds.includes(userData.cpf) ||
          phonesChilds.includes(userData.phone) ||
          emailsChilds.includes(userData.email)
        ) {
          return res.status(406).json({
            messagem: "The user is already registered"
          });
        } else {
          // storing data on database
          firebase
            .database()
            .ref(`users/${key}`)
            .set(userData)
            .then(() =>
              res.status(201).json({
                userData
              })
            );
        }
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
