<!doctype html>
<html>
    <head>

        <script  src="https://code.jquery.com/jquery-3.2.1.min.js"  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
        <!--<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>-->

        <link rel="stylesheet" href="{{ URL::asset('css/cube-summation.css') }}">
        <script type="text/javascript" src="{{URL::asset('js/cube-summation.js')}}"></script>

        <title>Cube Summation</title>
    </head>
    <body>
        <header>
            Cube Summation
        </header>

        <div class="container-fluid">

            <div class="row">
                <div class="col-12 col-sm-6 col-md-4">
                    <form id="form" action="/matrix">
                        <div class="row test-case-container">
                            <div class="col-12 col-sm-4 form-group">
                                <label for="test-cases" class="no-wrap">Test Cases</label>
                                <input type="text" id="test-cases" class="form-control">
                            </div>
                            <div class="col-12 col-sm-8" id="container-errors">
                                <div class="alert alert-danger d-none">
                                </div>
                            </div>
                        </div>
                        <div id="test-cases-container">
                        
                        </div>
                        <button type="submit" class="btn btn-success">Enviar</button>
                    </form>
                </div>
                <div class="col-12 col-xs-6 col-md-8">

                </div>
            </div>
            
        </div>

        <footer>
        
        </footer>
    </body>
</html>