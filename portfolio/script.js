/* ==========================================================
   script.js - Portfolio navigation

   Includes:
   1. Smooth section scrolling
   2. Active-section highlighting
   3. Mobile glass-nav menu
   4. Animated expanding search bar
   5. Dark / light theme switch
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");

  const navLinks = document.querySelectorAll(
    "nav a[href^='#']"
  );

  const sections = document.querySelectorAll(
    "main section[id]"
  );

  const navToggle = document.getElementById("nav-toggle");

  const searchBox = document.getElementById("nav-search");
  const searchToggle = document.getElementById("search-toggle");
  const searchInput = document.getElementById("nav-search-input");
  const searchClose = document.getElementById("search-close");

  const themeToggle = document.getElementById("theme-toggle");


  /* ==========================================================
     MOBILE MENU
     ========================================================== */

  function closeMenu() {
    if (!header || !navToggle) return;

    header.classList.remove("menu-open");

    navToggle.setAttribute(
      "aria-expanded",
      "false"
    );
  }


  /* ==========================================================
     SMOOTH SCROLLING
     ========================================================== */

  function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);

    if (!target) return;

    const headerHeight = header
      ? header.offsetHeight
      : 0;

    const sectionTop =
      target.getBoundingClientRect().top +
      window.scrollY;

    window.scrollTo({
      top: Math.max(
        0,
        sectionTop - headerHeight - 10
      ),
      behavior: "smooth"
    });
  }


  /* ==========================================================
     NAVIGATION LINK CLICK
     ========================================================== */

  navLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

      event.preventDefault();

      const href =
        link.getAttribute("href");

      if (!href) return;

      scrollToSection(
        href.substring(1)
      );

      closeMenu();
      closeSearch();

    });

  });


  /* ==========================================================
     ACTIVE NAVIGATION ITEM
     ========================================================== */

  function setActiveLink(sectionId) {

    navLinks.forEach(function (link) {

      const isActive =
        link.getAttribute("href") ===
        "#" + sectionId;

      link.classList.toggle(
        "active",
        isActive
      );

    });

  }


  /* ==========================================================
     SECTION OBSERVER
     Detects which section is currently visible
     ========================================================== */

  const observer =
    new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            setActiveLink(
              entry.target.id
            );

          }

        });

      },
      {
        rootMargin:
          "-42% 0px -52% 0px"
      }
    );


  sections.forEach(function (section) {

    observer.observe(section);

  });


  /* ==========================================================
     MOBILE MENU TOGGLE
     ========================================================== */

  if (navToggle) {

    navToggle.addEventListener(
      "click",
      function () {

        const isOpen =
          header.classList.toggle(
            "menu-open"
          );

        navToggle.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

      }
    );

  }


  /* ==========================================================
     SEARCH
     ========================================================== */

  function openSearch() {

    if (!searchBox || !searchInput)
      return;

    searchBox.classList.add("open");

    if (searchToggle) {
      searchToggle.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    window.setTimeout(
      function () {
        searchInput.focus();
      },
      90
    );

  }


  function closeSearch() {

    if (!searchBox || !searchInput)
      return;

    searchBox.classList.remove(
      "open"
    );

    if (searchToggle) {
      searchToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    searchInput.value = "";


    /* Restore all navigation items */

    navLinks.forEach(
      function (link) {

        const item =
          link.closest("li");

        if (item) {
          item.style.display = "";
        }

      }
    );

  }


  /* ==========================================================
     SEARCH BUTTON
     ========================================================== */

  if (searchToggle) {

    searchToggle.addEventListener(
      "click",
      function () {

        if (
          searchBox.classList.contains(
            "open"
          )
        ) {

          closeSearch();

        } else {

          openSearch();

        }

      }
    );

  }


  /* ==========================================================
     SEARCH CLOSE BUTTON
     ========================================================== */

  if (searchClose) {

    searchClose.addEventListener(
      "click",
      closeSearch
    );

  }


  /* ==========================================================
     LIVE SEARCH FILTER
     ========================================================== */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      function () {

        const query =
          searchInput.value
            .trim()
            .toLowerCase();


        navLinks.forEach(
          function (link) {

            const item =
              link.closest("li");

            if (!item) return;


            const text =
              link.textContent
                .toLowerCase();


            if (
              !query ||
              text.includes(query)
            ) {

              item.style.display = "";

            } else {

              item.style.display =
                "none";

            }

          }
        );

      }
    );


    /* ========================================================
       SEARCH KEYBOARD CONTROLS
       ======================================================== */

    searchInput.addEventListener(
      "keydown",
      function (event) {


        /* ESC closes search */

        if (
          event.key === "Escape"
        ) {

          event.preventDefault();

          closeSearch();

          return;

        }


        /* ENTER opens matching section */

        if (
          event.key === "Enter"
        ) {

          event.preventDefault();


          const query =
            searchInput.value
              .trim()
              .toLowerCase();


          if (!query) return;


          const match =
            Array.from(navLinks)
              .find(function (link) {

                return link.textContent
                  .toLowerCase()
                  .includes(query);

              });


          if (match) {

            scrollToSection(
              match
                .getAttribute("href")
                .substring(1)
            );

            closeSearch();
            closeMenu();

          }

        }

      }
    );

  }


  /* ==========================================================
     GLOBAL ESCAPE KEY
     ========================================================== */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        searchBox &&
        searchBox.classList.contains(
          "open"
        )
      ) {

        closeSearch();

      }

    }
  );


  /* ==========================================================
     CLOSE SEARCH WHEN CLICKING OUTSIDE
     ========================================================== */

  document.addEventListener(
    "click",
    function (event) {

      if (
        !searchBox ||
        !searchBox.classList.contains(
          "open"
        )
      ) {
        return;
      }


      if (
        !searchBox.contains(
          event.target
        )
      ) {

        closeSearch();

      }

    }
  );


  /* ==========================================================
     DARK / LIGHT THEME
     ========================================================== */

  function applyTheme(theme) {

    const isLight =
      theme === "light";

    document.body.classList.toggle(
      "light-theme",
      isLight
    );

    if (themeToggle) {

      themeToggle.classList.toggle(
        "is-light",
        isLight
      );

      themeToggle.setAttribute(
        "aria-pressed",
        String(isLight)
      );

      themeToggle.setAttribute(
        "aria-label",
        isLight
          ? "Switch to dark theme"
          : "Switch to light theme"
      );
    }
  }


  /* ==========================================================
     LOAD SAVED THEME
     ========================================================== */

  if (themeToggle) {

    let savedTheme = null;

    try {
      savedTheme =
        localStorage.getItem(
          "portfolio-theme"
        );
    } catch (error) {
      savedTheme = null;
    }


    if (
      savedTheme !== "light" &&
      savedTheme !== "dark"
    ) {
      savedTheme = "dark";
    }


    applyTheme(savedTheme);


    /* ========================================================
       THEME TOGGLE BUTTON
       ======================================================== */

    themeToggle.addEventListener(
      "click",
      function () {

        const currentTheme =
          document.body.classList.contains(
            "light-theme"
          )
            ? "light"
            : "dark";


        const newTheme =
          currentTheme === "light"
            ? "dark"
            : "light";


        applyTheme(newTheme);


        try {

          localStorage.setItem(
            "portfolio-theme",
            newTheme
          );

        } catch (error) {
          /* Ignore storage errors */
        }

      }
    );

  }


  /* ==========================================================
     INITIAL STATE
     ========================================================== */

  setActiveLink("home");

});