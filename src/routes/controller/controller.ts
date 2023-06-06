import express from "express";

interface Controller
{
    use(): express.Router;
}

export default Controller;