// check table exists

export const checkTableExists = (db, tableName) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
        [tableName],
        (_, result) => {
          if (result.rows.length > 0) {
            // Table exists
            resolve(true);
          } else {
            // Table does not exist
            resolve(false);
          }
        },
        (_, error) => {
          // Error occurred while executing the SQL query
          reject(error);
        }
      );
    });
  });
};

// create a table

// 1 userDetails

export const createUserDetailsTable = (db) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS "userDetails" (
          userId INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          salt TEXT NOT NULL,
          expenditure REAL NOT NULL DEFAULT 0,
          received REAL NOT NULL DEFAULT 0
        )`,
        [],
        () => {
          resolve(true);
          // Table created successfully or already exists
        },
        (_, error) => {
          // Error occurred while creating the table
          //consoleerror("Error creating user table:", error);
          reject(error);
        }
      );
    });
  });
};

// 2 cardDetails

export const createCardsDetailsTable = (db) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS cardDetails (
          userId INTEGER NOT NULL,
          cardNum INTEGER NOT NULL,
          cardName TEXT NOT NULL,
          balance INTEGER NOT NULL,
          uniqueId TEXT NOT NULL,
          type TEXT NOT NULL,
          PRIMARY KEY (uniqueId),
          FOREIGN KEY (userId) REFERENCES "userDetails" (userId) ON DELETE CASCADE
        )`,
        [],
        () => {
          resolve(true);
        },
        (_, error) => {
          //consoleerror('Error creating table "cards":', error);
          reject(error);
        }
      );
    });
  });
};

// 3 transaction details

export const createTransactionDetailsTable = (db) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS "transactionDetails" (
          userId INTEGER NOT NULL,
          transactionId INTEGER NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          description TEXT NOT NULL,
          "from" TEXT,
          "to" TEXT,
          unnecessary BOOLEAN,
          recurring BOOLEAN,
          transactionType TEXT NOT NULL,
          PRIMARY KEY (transactionId, userId),
          FOREIGN KEY (userId) REFERENCES "userDetails" (userId) ON DELETE CASCADE
        )`,
        [],
        () => {
          // Table created successfully or already exists
          resolve(true);
        },
        (_, error) => {
          // Error occurred while creating the table
          //consoleerror("Error creating table:", error);
          reject(error);
        }
      );
    });
  });
};

// insert userDetails

export const insertIntoUserDetails = (db, name, email, password, salt) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO "userDetails" (name, email, password,salt)
    VALUES (?, ?, ?,?)`,
        [name, email, password, salt],
        (_, result) => {
          if (result.rowsAffected > 0) {
            const insertedUserId = result.insertId;
            // //consolelog("User inserted successfully. userId:", insertedUserId);
            resolve({ userId: insertedUserId });
            // Perform further operations with the inserted data
          } else {
            //consolelog("Failed to insert user");
            // Handle the failure case
            resolve(null);
          }
        },
        (_, error) => {
          //consoleerror("Error inserting user:", error);
          // Handle the error case
          reject(error);
        }
      );
    });
  });
};

// get user details

export const getUserDetailsById = (db, userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT name, email FROM userDetails WHERE userId = ?",
        [userId],
        (_, result) => {
          if (result.rows.length > 0) {
            const { name, email, expenditure, received } = result.rows.item(0);
            resolve({ name, email, expenditure, received });
          } else {
            // User with the given ID not found
            resolve(null);
          }
        },
        (_, error) => {
          // Error occurred while executing the SQL query
          reject(error);
        }
      );
    });
  });
};

//delete all

export const deleteAllTables = (db) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        // Execute the DROP TABLE statements for each table
        tx.executeSql("DROP TABLE IF EXISTS userDetails");
        tx.executeSql("DROP TABLE IF EXISTS cardDetails");
        tx.executeSql("DROP TABLE IF EXISTS transactionDetails");
      },
      (_, error) => {
        // Error occurred while executing the transaction
        reject(error);
      },
      () => {
        // Transaction completed successfully
        resolve();
      }
    );
  });
};

// update card balance

export const updateCardBalance = (db, userId, cardNum, newBalance) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE cardDetails SET balance = ? WHERE userId = ? AND cardNum = ?`,
        [newBalance, userId, cardNum],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve(true);
            // Perform further operations if needed
          } else {
            resolve(false);
          }
        },
        (_, error) => {
          //consoleerror("Error updating card balance:", error);
          // Handle the error case
          reject(error);
        }
      );
    });
  });
};

// delete card

export const deleteCard = (db, userId, cardNum) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM cardDetails WHERE userId = ? AND cardNum = ?`,
        [userId, cardNum],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve(true);
            // Perform further operations if needed
          } else {
            resolve(false);
          }
        },
        (_, error) => {
          //consoleerror("Error deleting card :", error);
          // Handle the error case
          reject(error);
        }
      );
    });
  });
};

// delete transaction

export const deleteTransaction = (db, userId, transactionId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM transactionDetails WHERE userId=? AND transactionId = ?",
        [userId, transactionId],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (_, error) => {
          //consolelog("Error deleting transaction", error);
          reject(error);
        }
      );
    });
  });
};

// delete all transaction

export const deleteAllTransaction = (db, userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM transactionDetails WHERE userId=? ",
        [userId],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (_, error) => {
          //consolelog("Error deleting transaction", error);
          reject(error);
        }
      );
    });
  });
};

// check for email exists by checking count

export const checkEmailExists = (db, email) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT COUNT(*) FROM userDetails WHERE email = ?",
        [email],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          resolve(count > 0);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// login using email and password

export const loginUsingCreds = (db, email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT COUNT(*) FROM userDetails where email=? AND password=?",
        [email, password],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          resolve(count > 0);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// get salt,id from userDetails

export const getSaltAndId = (db, email) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT salt,userId FROM userDetails WHERE email = ?",
        [email],
        (_, result) => {
          if (result.rows.length > 0) {
            const salt = result.rows.item(0).salt;
            const userId = result.rows.item(0).userId;
            resolve({ salt, userId });
          } else {
            resolve(null); // User not found
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// get expenditure, received from userDetails

export const getSpendingDetails = (db, userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT expenditure,received FROM userDetails WHERE userId = ?",
        [userId],
        (_, result) => {
          if (result.rows.length > 0) {
            const expenditure = result.rows.item(0).expenditure;
            const received = result.rows.item(0).received;
            resolve({ expenditure, received });
          } else {
            resolve(null); // User not found
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// check unique id before adding cardDetails

export const checkUniqueIdExists = (db, userId, uniqueId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT COUNT(*) FROM cardDetails WHERE uniqueId = ? AND userId =?",
        [uniqueId, userId],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          resolve(count > 0);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// delete a user

export const deleteUser = (db, userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM "userDetails" WHERE userId = ?`,
        [userId],
        (_, result) => {
          resolve(result.rowsAffected > 0);
        },
        (_, error) => {
          //consoleerror("Error deleting user:", error);
          reject(error);
        }
      );
    });
  });
};

// update expenditure and received

export const updateTransactionUserDetails = async (
  db,
  amount1,
  amount2,
  userId
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE "userDetails" SET expenditure = ?, received = ? WHERE userId = ?',
        [amount1, amount2, userId],
        (_, result) => {
          resolve(result.rowsAffected > 0);
        },
        (_, error) => {
          //consoleerror("Error updating user:", error);
          reject(error);
        }
      );
    });
  });
};

// get cards

export const getCards = async (db, userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM cardDetails WHERE userId =?",
        [userId],
        (_, result) => {
          const cards = [];
          for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            cards.push(row);
          }
          resolve({ cards });
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// insert cardDetails

export const insertIntoCardDetails = (
  db,
  userId,
  cardNum,
  cardName,
  balance,
  uniqueId,
  type
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO cardDetails (userId,cardNum, cardName, balance, uniqueId, type) VALUES (?, ?,?, ?, ?, ?)",
        [userId, cardNum, cardName, balance, uniqueId, type],
        (_, result) => {
          if (result.rowsAffected > 0) {
            // Insertion successful
            // //consolelog("Card inserted successfully");
            resolve(true);
          } else {
            // Insertion failed
            //consolelog("Failed to insert card");
            resolve(false);
          }
        },
        (_, error) => {
          // Error occurred while executing the SQL query
          //consoleerror("Error inserting card:", error);
          reject(error);
        }
      );
    });
  });
};

// get Transactions

export const getTransactions = async (db, userId, transactionPage) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT COUNT(*) FROM transactionDetails WHERE userId =?",
        [userId],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];

          tx.executeSql(
            "SELECT * FROM transactionDetails WHERE userId = ? ORDER BY transactionId DESC LIMIT ? OFFSET ?",
            [userId, 8, (transactionPage - 1) * 8],
            (_, result) => {
              const transactions = [];
              for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                transactions.push(row);
              }
              resolve({ transactions, count });
            },
            (_, error) => {
              reject(error);
            }
          );
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// insert transactionDetails

export const insertIntoTransactionDetails = (
  db,
  userId,
  transactionId,
  amount,
  date,
  description,
  from,
  to,
  unnecessary,
  recurring,
  transactionType
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO transactionDetails (userId, transactionId, amount, date, description, "from", "to","unnecessary","recurring", transactionType) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)',
        [
          userId,
          transactionId,
          amount,
          date,
          description,
          from,
          to,
          unnecessary,
          recurring,
          transactionType,
        ],
        (_, result) => {
          if (result.rowsAffected > 0) {
            // Insertion successful
            resolve(true);
          } else {
            // Insertion failed
            resolve(false);
          }
        },
        (_, error) => {
          // Error occurred while executing the SQL query
          //consoleerror("Error inserting transaction:", error);
          reject(error);
        }
      );
    });
  });
};

// get transaction length

export const transactionLength = async (db, userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT COUNT(*) FROM transactionDetails WHERE userId =?",
        [userId],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          resolve(count);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// get transactions for month of ...

export const getMonthlyTransactions = async (db, userId, month, year) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM transactionDetails WHERE userId=? AND substr(date,1,7) = ? `,
        [userId, `${year}-${month}`],
        (_, result) => {
          let spent = 0.0;
          let income = 0.0;
          for (let i = 0; i < result.rows.length; i++) {
            if (result.rows.item(i).transactionType == "Spent") {
              spent += result.rows.item(i).amount;
            } else if (result.rows.item(i).transactionType == "Received") {
              income += result.rows.item(i).amount;
            }
          }
          resolve({ spent, income });
        },
        (_, error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  });
};

// get Transactions

export const getRecentTransactions = async (db, userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT COUNT(*) FROM transactionDetails WHERE userId =?",
        [userId],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];

          tx.executeSql(
            "SELECT * FROM transactionDetails WHERE userId = ? ORDER BY transactionId DESC LIMIT 4",
            [userId],
            (_, result) => {
              const transactions = [];
              for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                transactions.push(row);
              }
              resolve({ transactions, count });
            },
            (_, error) => {
              reject(error);
            }
          );
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};
