const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
	"https://samadinho-ship-it.github.io",
	"http://localhost:5500",
	"http://127.0.0.1:5500"
];

app.use(cors({
	origin(origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}

		return callback(new Error("Origin not allowed by CORS."));
	}
}));

app.use(express.json({ limit: "1mb" }));

const ENQUIRY_URL =
	"https://samadinho-ship-it.github.io/infinite-iq/enquiry.html";

const PLANNER_URL =
	"https://samadinho-ship-it.github.io/infinite-iq/planner.html";

function answerFor(raw) {
	const q = raw
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s]/gu, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(q)) {
		return "Hello! Welcome to INFINITE IQ. I can explain our services, compare website packages, answer questions about costs, or help you start a project. What would you like to know?";
	}

	if (/(price|pricing|cost|how much|quote|budget)/.test(q)) {
		return "INFINITE IQ uses custom quotes rather than fixed package prices. The final quote depends on your project's pages, features and requirements. Domains, hosting and third-party services may have separate costs. Share your requirements here: " + ENQUIRY_URL;
	}

	if (/(starter|one page|one-page)/.test(q)) {
		return "The Starter Website is designed for individuals and small businesses taking their first step online. It includes a one-page website, mobile-friendly design, About and Services sections, contact information and a basic search-friendly structure. Pricing is a custom quote. Enquire here: " + ENQUIRY_URL;
	}

	if (/(professional|growing business)/.test(q)) {
		return "The Professional Website is designed for growing businesses. It includes a multi-section website, custom visual design, mobile-friendly layout, a projects or product showcase, and contact and call-to-action sections. Pricing is a custom quote: " + ENQUIRY_URL;
	}

	if (/(premium|customised|customized|advanced)/.test(q)) {
		return "The Premium Website is for brands looking for a customised digital experience. It includes a custom multi-page experience, advanced visual features, custom interactive elements, expanded brand presentation and project-specific features. Pricing is a custom quote: " + ENQUIRY_URL;
	}

	if (/(package|plans|which.*choose|choose.*package|which.*website)/.test(q)) {
		return "INFINITE IQ has three website packages:\n\n• Starter: a one-page website for individuals and small businesses.\n• Professional: a multi-section website with a project or product showcase.\n• Premium: a customised multi-page experience with advanced features.\n\nAll packages use custom quotes. Tell us about your business and the features you need: " + ENQUIRY_URL;
	}

	if (/(service|what do you do|what.*offer)/.test(q)) {
		return "INFINITE IQ focuses on three areas:\n\n1. Website development — modern, responsive websites.\n2. Digital tools — online tools that help organise information and plan projects.\n3. Digital products — planners, templates and guides.\n\nExplore our website or send a project enquiry: " + ENQUIRY_URL;
	}

	if (/(mobile|phone|responsive)/.test(q)) {
		return "Yes. Mobile-friendly layouts are included in the website packages, with designs planned for phones as well as larger screens.";
	}

	if (/(hosting|domain|publish|go live)/.test(q)) {
		return "Hosting and domain names are not automatically included in the website packages. They may involve separate costs, as can some third-party services. These arrangements should be discussed before a project begins.";
	}

	if (/(free|payment|pay|charge|enquiry fee)/.test(q)) {
		return "There is no payment required simply to submit an enquiry. You can share your project requirements first, and the scope and quote can be discussed before work begins: " + ENQUIRY_URL;
	}

	if (/(planner|plan my website)/.test(q)) {
		return "The free Business Website Planner helps you organise your website goals, pages and key requirements before starting a project. Open it here: " + PLANNER_URL;
	}

	if (/(dashboard|client portal|portal|demo)/.test(q)) {
		return "INFINITE IQ includes browser-based Project Dashboard and Client Portal demonstrations. They are demos, not live client account systems. Demo information stays in the visitor's browser.";
	}

	if (/(start|begin|project|work with you|contact|enquir)/.test(q)) {
		return "To get started, visit the INFINITE IQ enquiry page and share what your business does, your goals and any features you have in mind. You do not need a complete plan before sending an enquiry: " + ENQUIRY_URL;
	}

	if (/(digital product|template|guide)/.test(q)) {
		return "INFINITE IQ's digital products include useful resources such as planners, templates and guides. For a specific product question, please describe what you are looking for.";
	}

	return "I can help with INFINITE IQ's website services, packages, custom quotes, mobile-friendly design, hosting and domains, the free planner, and project enquiries. Try asking about one of those topics, or send your requirements here: " + ENQUIRY_URL;
}

app.get("/", (_req, res) => {
	res.json({
		service: "INFINITE IQ Knowledge Assistant",
		status: "online",
		mode: "free knowledge mode"
	});
});

app.get("/health", (_req, res) => {
	res.json({ ok: true });
});

app.post("/chat", (req, res) => {
	const message = req.body && req.body.message;

	if (typeof message !== "string" || !message.trim()) {
		return res.status(400).json({
			error: "Please enter a message."
		});
	}

	if (message.length > 4000) {
		return res.status(413).json({
			error: "Please keep your message under 4,000 characters."
		});
	}

	return res.json({
		reply: answerFor(message)
	});
});

app.listen(PORT, "0.0.0.0", () => {
	console.log(
		`INFINITE IQ public assistant listening on port ${PORT}`
	);
});
