const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "EventPulse API",
            version: "1.0.0",
            description: "API documentation for the EventPulse application"
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Local server"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },

        paths: {

            // =========================
            // AUTHENTICATION
            // =========================

            "/api/auth/register": {
                post: {
                    tags: ["Authentication"],
                    summary: "Register a new user",

                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["name", "email", "password"],
                                    properties: {
                                        name: {
                                            type: "string",
                                            example: "John Doe"
                                        },
                                        email: {
                                            type: "string",
                                            format: "email",
                                            example: "john@example.com"
                                        },
                                        password: {
                                            type: "string",
                                            minLength: 6,
                                            example: "password123"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        201: {
                            description: "User registered successfully"
                        },
                        409: {
                            description: "Email already exists"
                        },
                        422: {
                            description: "Validation error"
                        }
                    }
                }
            },

            "/api/auth/login": {
                post: {
                    tags: ["Authentication"],
                    summary: "Login a user",

                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["email", "password"],
                                    properties: {
                                        email: {
                                            type: "string",
                                            format: "email",
                                            example: "john@example.com"
                                        },
                                        password: {
                                            type: "string",
                                            example: "password123"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        200: {
                            description: "Login successful"
                        },
                        401: {
                            description: "Invalid credentials"
                        },
                        422: {
                            description: "Validation error"
                        }
                    }
                }
            },


            // =========================
            // EVENTS
            // =========================

            "/api/events": {
                get: {
                    tags: ["Events"],
                    summary: "Get all events",

                    parameters: [
                        {
                            name: "city",
                            in: "query",
                            schema: {
                                type: "string"
                            },
                            description: "Filter events by city"
                        },
                        {
                            name: "category",
                            in: "query",
                            schema: {
                                type: "string"
                            },
                            description: "Filter events by category"
                        },
                        {
                            name: "search",
                            in: "query",
                            schema: {
                                type: "string"
                            },
                            description: "Search events"
                        },
                        {
                            name: "page",
                            in: "query",
                            schema: {
                                type: "integer",
                                minimum: 1
                            },
                            description: "Page number"
                        },
                        {
                            name: "limit",
                            in: "query",
                            schema: {
                                type: "integer",
                                minimum: 1
                            },
                            description: "Number of events per page"
                        },
                        {
                            name: "sort",
                            in: "query",
                            schema: {
                                type: "string"
                            },
                            description: "Sort events"
                        }
                    ],

                    responses: {
                        200: {
                            description: "Events retrieved successfully"
                        }
                    }
                },

                post: {
                    tags: ["Events"],
                    summary: "Create a new event",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: [
                                        "title",
                                        "date",
                                        "category",
                                        "capacity",
                                        "venue"
                                    ],
                                    properties: {
                                        title: {
                                            type: "string",
                                            example: "Technology Conference"
                                        },
                                        description: {
                                            type: "string",
                                            example: "A technology event"
                                        },
                                        capacity: {
                                            type: "integer",
                                            example: 200
                                        },
                                        date: {
                                            type: "string",
                                            format: "date-time"
                                        },
                                        city: {
                                            type: "string",
                                            example: "Cairo"
                                        },
                                        category: {
                                            type: "string",
                                            example: "64f123456789abcdef123456"
                                        },
                                        venue: {
                                            type: "string",
                                            example: "Cairo Conference Center"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        201: {
                            description: "Event created successfully"
                        },
                        401: {
                            description: "Authentication required"
                        },
                        403: {
                            description: "Admin access required"
                        },
                        422: {
                            description: "Validation error"
                        }
                    }
                }
            },


            "/api/events/{id}": {
                get: {
                    tags: ["Events"],
                    summary: "Get an event by ID",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description: "Event retrieved successfully"
                        },
                        404: {
                            description: "Event not found"
                        }
                    }
                },

                patch: {
                    tags: ["Events"],
                    summary: "Update an event",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        }
                    ],

                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        title: {
                                            type: "string"
                                        },
                                        description: {
                                            type: "string"
                                        },
                                        capacity: {
                                            type: "integer"
                                        },
                                        date: {
                                            type: "string",
                                            format: "date-time"
                                        },
                                        city: {
                                            type: "string"
                                        },
                                        category: {
                                            type: "string"
                                        },
                                        venue: {
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        200: {
                            description: "Event updated successfully"
                        },
                        401: {
                            description: "Authentication required"
                        },
                        403: {
                            description: "Admin access required"
                        },
                        404: {
                            description: "Event not found"
                        }
                    }
                },

                delete: {
                    tags: ["Events"],
                    summary: "Delete an event",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description: "Event deleted successfully"
                        },
                        401: {
                            description: "Authentication required"
                        },
                        403: {
                            description: "Admin access required"
                        },
                        404: {
                            description: "Event not found"
                        }
                    }
                }
            },


            // =========================
            // REGISTRATIONS
            // =========================

            "/api/registrations": {
                post: {
                    tags: ["Registrations"],
                    summary: "Register for an event",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["eventId"],
                                    properties: {
                                        eventId: {
                                            type: "string",
                                            example: "64f123456789abcdef123456"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        201: {
                            description: "Registration created successfully"
                        },
                        401: {
                            description: "Authentication required"
                        },
                        409: {
                            description: "Registration conflict"
                        },
                        422: {
                            description: "Validation error"
                        }
                    }
                }
            },


            "/api/registrations/myEvents": {
                get: {
                    tags: ["Registrations"],
                    summary: "Get the current user's registrations",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    responses: {
                        200: {
                            description: "User registrations retrieved successfully"
                        },
                        401: {
                            description: "Authentication required"
                        }
                    }
                }
            },


            "/api/registrations/{id}": {
                delete: {
                    tags: ["Registrations"],
                    summary: "Cancel a registration",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description: "Registration cancelled successfully"
                        },
                        401: {
                            description: "Authentication required"
                        },
                        404: {
                            description: "Registration not found"
                        }
                    }
                }
            },


            // =========================
            // ANNOUNCEMENTS
            // =========================

            "/api/announcements/{eventId}": {
                get: {
                    tags: ["Announcements"],
                    summary: "Get announcements for an event",

                    parameters: [
                        {
                            name: "eventId",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description: "Announcements retrieved successfully"
                        },
                        404: {
                            description: "Event not found"
                        }
                    }
                }
            },


            "/api/announcements": {
                post: {
                    tags: ["Announcements"],
                    summary: "Create an announcement",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        eventId: {
                                            type: "string",
                                            example: "64f123456789abcdef123456"
                                        },
                                        message: {
                                            type: "string",
                                            example: "The event starts at 10 AM."
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        201: {
                            description: "Announcement created successfully"
                        },
                        401: {
                            description: "Authentication required"
                        },
                        403: {
                            description: "Admin access required"
                        }
                    }
                }
            }
        }
    }
};

module.exports = swaggerJsdoc(swaggerOptions);