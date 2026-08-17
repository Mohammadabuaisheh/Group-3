const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3000;
app.use(cookieParser());
const pets = [
  { name: "Max", type: "dog", age: 3 },
  { name: "Luna", type: "cat", age: 2 },
  { name: "Bella", type: "dog", age: 5 },
  { name: "Milo", type: "cat", age: 1 },
  { name: "Charlie", type: "bird", age: 4 }
];
app.get("/", (req, res) => {
  const search = req.query.search || "";
  const type = req.query.type || "";
  const theme = req.cookies.theme || "light";
  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      type === "" || pet.type === type;

    return matchesSearch && matchesType;
  });
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Pet Search</title>

      <style>
        body {
          font-family: Arial;
          padding: 30px;
          background: ${theme === "dark" ? "#222" : "#fff"};
          color: ${theme === "dark" ? "#fff" : "#222"};
        }

        .pet {
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #aaa;
        }

        input, select, button {
          padding: 8px;
          margin: 5px;
        }
      </style>
    </head>

    <body>

      <h1>🐾 Pet Search</h1>

      <!-- GET Search Form -->
      <form method="GET" action="/">
        <input
          type="text"
          name="search"
          placeholder="Search pet..."
          value="${search}"
        >

        <select name="type">
          <option value="">All</option>
          <option value="dog" ${type === "dog" ? "selected" : ""}>
            Dogs
          </option>
          <option value="cat" ${type === "cat" ? "selected" : ""}>
            Cats
          </option>
          <option value="bird" ${type === "bird" ? "selected" : ""}>
            Birds
          </option>
        </select>

        <button type="submit">Search</button>
      </form>

      <hr>

      <h2>Choose Theme</h2>

      <a href="/theme/light">
        <button>☀️ Light Mode</button>
      </a>

      <a href="/theme/dark">
        <button>🌙 Dark Mode</button>
      </a>

      <h2>Pets</h2>

      ${
        filteredPets.length > 0
          ? filteredPets.map((pet) => `
              <div class="pet">
                <strong>${pet.name}</strong><br>
                Type: ${pet.type}<br>
                Age: ${pet.age}
              </div>
            `).join("")
          : "<p>No pets found.</p>"
      }

    </body>
    </html>
  `);
});

app.get("/theme/:theme", (req, res) => {
  const theme = req.params.theme;

  if (theme === "light" || theme === "dark") {
    res.cookie("theme", theme, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true
    });
  }

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});