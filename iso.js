const ISO_DIRECTORY = "./ISO/";

async function loadFiles() {

    const fileList = document.getElementById("file-list");

    try {

        const response = await fetch(ISO_DIRECTORY);

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const html = await response.text();

        const parser = new DOMParser();
        const directory = parser.parseFromString(html, "text/html");

        const links = directory.querySelectorAll("a");

        fileList.innerHTML = "";

        let foundFiles = false;

        links.forEach(function(link) {

            const href = link.getAttribute("href");

            if (!href) {
                return;
            }

            /*
             * Ignore parent directories and folders.
             */
            if (
                href === "../" ||
                href === "./" ||
                href.endsWith("/")
            ) {
                return;
            }

            foundFiles = true;

            /*
             * Use the actual href from the server.
             * Do NOT use link.textContent here because
             * some directory listings include file metadata
             * such as dates next to the filename.
             */
            const fileURL = new URL(
                href,
                new URL(ISO_DIRECTORY, window.location.href)
            );

            const fileName =
                decodeURIComponent(
                    fileURL.pathname.split("/").pop()
                );

            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            const sizeCell = document.createElement("td");
            const dateCell = document.createElement("td");

            const fileLink = document.createElement("a");

            fileLink.href = fileURL.href;
            fileLink.textContent = fileName;

            nameCell.appendChild(fileLink);

            /*
             * These will be filled when the server exposes
             * file metadata in a usable way.
             */
            sizeCell.textContent = "-";
            dateCell.textContent = "-";

            row.appendChild(nameCell);
            row.appendChild(sizeCell);
            row.appendChild(dateCell);

            fileList.appendChild(row);

        });

        if (!foundFiles) {

            fileList.innerHTML = `
                <tr>
                    <td colspan="3" class="loading">
                        No files found in ISO/.
                    </td>
                </tr>
            `;

        }

    } catch (error) {

        console.error(error);

        fileList.innerHTML = `
            <tr>
                <td colspan="3" class="error">
                    Could not load the ISO directory.
                    <br><br>
                    Make sure the ISO folder exists and
                    directory listing is enabled.
                </td>
            </tr>
        `;

    }
}


function toggleTheme() {

    document.body.classList.toggle("light");

    const button =
        document.querySelector(".theme-button");

    const icon =
        button.querySelector("svg");

    const text =
        button.querySelector("span");

    if (document.body.classList.contains("light")) {

        text.textContent = "Dark";

        icon.innerHTML = `
            <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3
                     A6.5 6.5 0 0 0 21 12.8z"/>
        `;

    } else {

        text.textContent = "Light";

        icon.innerHTML = `
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2"/>
            <path d="M12 20v2"/>
            <path d="M4.93 4.93l1.41 1.41"/>
            <path d="M17.66 17.66l1.41 1.41"/>
            <path d="M2 12h2"/>
            <path d="M20 12h2"/>
            <path d="M4.93 19.07l1.41-1.41"/>
            <path d="M17.66 6.34l-1.41-1.41"/>
        `;

    }
}


loadFiles();