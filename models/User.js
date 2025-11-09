//models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Ορισμός Σχήματος (Schema Definition)
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:[true,'Please enter email address'],
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Παρακαλώ εισάγετε έγκυρη διεύθυνση email']
    },

    password:{
        type: String,
        required: [true, 'Please enter password'],
        minlenght: [6, 'The password must be at least 6 characters long.'],
        select: false
    },

    // Λίστα παρακολούθησης: Ένα Array από strings για τα σύμβολα (π.χ. 'BTC', 'AAPL')
    watchlist:{
        type:[String],
        default: []
    }
},{
    // Χρονικές σφραγίδες: Προσθέτει αυτόματα τα πεδία createdAt και updatedAt
    timestamps: true  
});


// =======================================================================
// 2. MIDDLEWARE ΤΟΥ MONGOOSE (Πριν την Αποθήκευση)
// =======================================================================

// Συνάρτηση "pre-save": Εκτελείται ακριβώς πριν αποθηκευτεί το έγγραφο (document)

userSchema.pre('save', async function (next){
// Ελέγχουμε αν ο κωδικός έχει τροποποιηθεί (π.χ. αν είναι νέος χρήστης ή αλλαγή κωδικού)
if (!this.isModified('password')) {
    return next(); // Αν όχι, συνεχίζουμε χωρίς να κάνουμε hash
}
// 1. Δημιουργία Salt: Το Salt είναι ένα τυχαίο string που χρησιμοποιείται για να κάνει 
// το hashing πιο ασφαλές. Το 10 είναι ο αριθμός των γύρων.
const salt = await bcrypt.genSalt(10);

// 2. Hashing (Κρυπτογράφηση): Ο κωδικός του χρήστη κρυπτογραφείται.
//    Αντικαθιστούμε τον απλό κωδικό με τον κρυπτογραφημένο (hash).
 this.password = await bcrypt.hash(this.password, salt);

 next();
});

// =======================================================================
// 3. ΜΕΘΟΔΟΙ (Custom Methods)
// =======================================================================

// Δημιουργούμε μια μέθοδο για να ελέγχουμε αν ο εισαγόμενος κωδικός ταιριάζει με τον κρυπτογραφημένο.
userSchema.methods.matchPassword = async function (enteredPassword) {
// Η bcrypt.compare() αποκρυπτογραφεί τον αποθηκευμένο hash και τον συγκρίνει με τον 
// κωδικό που έδωσε ο χρήστης κατά το login. Επιστρέφει true ή false.
 return await bcrypt.compare(enteredPassword, this.password);
};


// =======================================================================
// 4. Εξαγωγή Μοντέλου
// =======================================================================

// Δημιουργούμε το τελικό Μοντέλο Mongoose (το οποίο θα χρησιμοποιηθεί στα Controllers)
const User = mongoose.model('User', userSchema);

module.exports = User;


